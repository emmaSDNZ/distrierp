from django.db import models

class ProductCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    parent= models.ForeignKey('self', 
                              null=True, 
                              blank=True, 
                              on_delete=models.CASCADE,
                              related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def get_subcategories(self):
        #Retorna todas las subcategorías de la categoría actual
        return self.children.all()
    
    @classmethod
    def get_default_category(cls):
        category, created = cls.objects.get_or_create(name='All')
        return category.id 
    
        