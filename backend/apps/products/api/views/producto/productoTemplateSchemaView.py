# En views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from ...serializer.producto._productoSerializer import ProductoTemplateSerializer

class ProductoTemplateSchemaAPIView(APIView):
    def get(self, request):
        serializer = ProductoTemplateSerializer()
        fields = serializer.get_fields()
        schema = {
            field_name: {
                "type": str(field.__class__.__name__),
                "required": field.required,
                "label": field.label,
                "help_text": field.help_text
            }
            for field_name, field in fields.items()
        }
        return Response(schema)
