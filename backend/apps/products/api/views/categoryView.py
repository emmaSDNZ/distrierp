from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.products.api.serializer.categorySerializer import CategorySerializer
from apps.products.models.categoryModel import Category


class CategoryListAPIView(generics.ListAPIView):
    serializer_class= CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(state=True)
    
class CategoryCreateAPIView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                {"message": "Categoria creada correctamente", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.filter(state=True)
    serializer_class = CategorySerializer

    def get(self, request, pk):
        category = self.get_object()
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object()
        serializer = CategorySerializer(category, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object()
        category.delete()
        return Response({"message": "Categoría eliminada"}, status=status.HTTP_204_NO_CONTENT)
