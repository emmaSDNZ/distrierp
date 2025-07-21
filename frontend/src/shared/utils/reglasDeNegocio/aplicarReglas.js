// ... (código existente de evaluarCondicionSimple - sin cambios) ...
function evaluarCondicionSimple(fila, cond) {
  const valFila = fila[cond.columna];
  const valFilaString = valFila != null ? String(valFila) : '';

  const valCond = cond.operador === "between" ? [cond.valor, cond.valorExtra] : cond.valor;

  const numValFila = parseFloat(valFila);
  const numValCond = parseFloat(valCond);

  switch (cond.operador) {
    case "==":
      return valFila == valCond;
    case "!=":
      return valFila != valCond;
    case ">":
      return !isNaN(numValFila) && !isNaN(numValCond) && numValFila > numValCond;
    case "<":
      return !isNaN(numValFila) && !isNaN(numValCond) && numValFila < numValCond;
    case "includes":
      return valFilaString.includes(String(valCond));
    case "regex":
      try {
        return new RegExp(String(valCond)).test(valFilaString);
      } catch (e) {
        console.error(`Error de RegExp en columna ${cond.columna} con valor "${valCond}":`, e);
        return false;
      }
    case "between":
      if (!Array.isArray(valCond) || valCond.length !== 2) {
        console.warn(`Operador 'between' requiere un array de 2 valores. Recibido: ${valCond}`);
        return false;
      }
      const numValMin = parseFloat(valCond[0]);
      const numValMax = parseFloat(valCond[1]);
      return (
        !isNaN(numValFila) &&
        !isNaN(numValMin) &&
        !isNaN(numValMax) &&
        numValFila >= numValMin &&
        numValFila <= numValMax
      );
    default:
      return false;
  }
}

export function cumpleCondiciones(fila, regla) {
  if (!regla.condiciones || regla.condiciones.length === 0) return true;

  function evaluarGrupo(conds, operadorLogicoParaInternos = "AND", nivel = 0) {
    if (conds.length === 0) return true;

    let resultado;
    if (operadorLogicoParaInternos === "AND") {
      resultado = true;
    } else if (operadorLogicoParaInternos === "OR") {
      resultado = false;
    }

    const indent = "  ".repeat(nivel);
    console.log(`${indent}Evaluando grupo (Nivel ${nivel}) con operador INTERNO: ${operadorLogicoParaInternos}. Condiciones:`, conds.map(c => c.columna || c.tipo));

    for (let i = 0; i < conds.length; i++) {
      let cond = conds[i];
      let val;

      // Importante: El operador que se usa para combinar 'cond' con el elemento anterior *dentro del mismo grupo*
      // NO es el operadorLogico del subgrupo, sino el operadorLogico de 'cond'.
      // Sin embargo, si es el primer elemento (i === 0), no hay operador previo.
      if (i > 0 && cond.operadorLogico && operadorLogicoParaInternos !== cond.operadorLogico) {
          // Esto puede indicar una inconsistencia en la UI/data model si el operador entre elementos
          // difiere del operador principal del grupo. Tu UI actual tiene un selector por elemento y
          // un selector por grupo. Esta lógica asume que el operador principal del grupo (operadorLogicoParaInternos)
          // es el que se usa para combinar sus elementos. Si quieres que los operadores individuales
          // prevalezcan, la lógica de `cumpleCondiciones` debería ser más compleja para construir un árbol AST.
          // Por ahora, asumimos que el `operadorLogicoInterno` del padre es el que rige.
      }


      if (cond.tipo === "grupo") {
        console.log(`${indent}  Entrando en subgrupo (Nivel ${nivel + 1}):`, cond.condiciones.map(c => c.columna || c.tipo));
        // Aquí se pasa el operadorLogicoInterno del subgrupo para su propia evaluación interna
        val = evaluarGrupo(cond.condiciones || [], cond.operadorLogicoInterno || "AND", nivel + 1);
        console.log(`${indent}  Resultado de subgrupo (Nivel ${nivel + 1}): ${val}`);
      } else if (cond.tipo === "condicion") {
        val = evaluarCondicionSimple(fila, cond);
        console.log(`${indent}  Condición #${i}: Columna: ${cond.columna}, Operador: ${cond.operador}, Valor: "${cond.valor}", ValorFila: "${fila[cond.columna]}", Resultado: ${val}`);
      } else {
        val = false;
      }

      // Aplica el operador lógico del *grupo actual* (operadorLogicoParaInternos) a los resultados de sus elementos
      if (operadorLogicoParaInternos === "AND") {
        resultado = resultado && val;
        if (!resultado) {
          console.log(`${indent}    AND - Corto circuito. Resultado parcial: ${resultado}`);
          break;
        }
      } else if (operadorLogicoParaInternos === "OR") {
        resultado = resultado || val;
        if (resultado) {
          console.log(`${indent}    OR - Corto circuito. Resultado parcial: ${resultado}`);
          break;
        }
      }
    }
    console.log(`${indent}Finalizado grupo (Nivel ${nivel}) con operador INTERNO ${operadorLogicoParaInternos}. Resultado final: ${resultado}`);
    return resultado;
  }

  // El grupo raíz usa su propio operadorLogicoInterno para combinar sus elementos
  const finalResult = evaluarGrupo(regla.condiciones, regla.operadorLogicoInterno || "AND", 0);
  console.log(`--- Fila: ${JSON.stringify(fila)}, Cumple Condiciones Generales: ${finalResult} ---`);
  return finalResult;
}

export function aplicarReglasADatos(datos, regla) {
  if (
    !regla.condiciones || regla.condiciones.length === 0 ||
    !regla.acciones || regla.acciones.length === 0
  ) {
    console.log("No hay condiciones o acciones definidas. Retornando datos sin modificar.");
    return datos;
  }

  console.log("------------------------------------------");
  console.log("Iniciando aplicación de reglas.");
  console.log("Regla completa a aplicar:", JSON.stringify(regla, null, 2));
  console.log("------------------------------------------");

  return datos.map((fila, index) => {
    let filaTrabajo = { ...fila };

    console.log(`\nProcesando Fila #${index} (ID: ${fila.id || 'N/A'}):`, JSON.stringify(filaTrabajo));

    // Pasa la regla tal cual, `cumpleCondiciones` usará `regla.operadorLogicoInterno`
    const cumple = cumpleCondiciones(filaTrabajo, regla);
    console.log(`  Resultado final para Fila #${index}: Cumple Condiciones: ${cumple}`);

    if (!cumple) {
      console.log(`  Fila #${index} no cumple las condiciones. No se aplicarán acciones.`);
      return fila;
    }

    console.log(`  Fila #${index} CUMPLE las condiciones. Aplicando acciones...`);

    regla.acciones.forEach(({ columna, tipo, valor }) => {
      const valOriginal = parseFloat(filaTrabajo[columna]);
      const valAccion = parseFloat(valor);

      if (isNaN(valOriginal)) {
        console.warn(`    ADVERTENCIA: La columna "${columna}" de la fila #${index} tiene un valor no numérico o undefined ("${filaTrabajo[columna]}"). No se pudo aplicar la acción "${tipo}".`);
        return;
      }
      if (isNaN(valAccion)) {
        console.warn(`    ADVERTENCIA: El valor de la acción "${valor}" para la columna "${columna}" no es un número válido. No se pudo aplicar la acción "${tipo}".`);
        return;
      }

      let nuevoValor;
      if (tipo === "increase") {
        nuevoValor = valOriginal * (1 + valAccion / 100);
      } else if (tipo === "decrease") {
        nuevoValor = valOriginal * (1 - valAccion / 100);
      } else if (tipo === "set") {
        nuevoValor = valAccion;
      }
      filaTrabajo[columna] = nuevoValor;
      console.log(`      Acción aplicada a columna "${columna}": Tipo "${tipo}", Valor Acción: ${valor}. Original: ${valOriginal}, Nuevo Valor: ${filaTrabajo[columna]}`);
    });

    console.log(`  Fila #${index} FINALIZADA. Nueva fila:`, JSON.stringify(filaTrabajo));
    return filaTrabajo;
  });
}