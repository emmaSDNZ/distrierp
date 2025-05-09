"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import ProductsList from '../../components/products/ProductList';
import NewButton from '../../components/navbar/NewButton';
import ProductForm from '../../components/products/ProductForm';

export default function ProductView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('view');

  const showForm = view === 'new';

  return (
    <div>
      <NewButton onClick={() => router.push('/appInventory/products?view=new')} />
      {showForm ? <ProductForm /> : <ProductsList />}
    </div>
  );
}
