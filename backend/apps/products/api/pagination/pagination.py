from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 50  # O el tamaño que prefieras

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Lista paginada obtenida correctamente.',
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'data': data
        })