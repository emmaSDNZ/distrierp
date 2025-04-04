import ProductsList from './components/products/ProductsList';
import Layout from './components/Layout';
import { ProductProvider } from '@/context/ProductContext';
import Attribute from './components/attribute/Attribute';
import Reports from './reports/Reports';

export default function Products() {
  return (
    <ProductProvider>
  
        <Layout>
          <ProductsList />
        </Layout>

    </ProductProvider>
  );
}