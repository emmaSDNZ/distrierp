
$env:DJANGO_SETTINGS_MODULE="core.settings.local"
python manage.py makemigrations products

.\venv\Scripts\Activate.ps1  
$env:DJANGO_SETTINGS_MODULE="core.settings.local"
python manage.py makemigrations


$env:DJANGO_SETTINGS_MODULE="core.settings.local"
python manage.py makemigrations products

.\venv\Scripts\Activate.ps1  
$env:DJANGO_SETTINGS_MODULE="core.settings.local"
python manage.py makemigrations

python -m venv venv

python manage.py runserver --settings=core.settings.local
pip install django-cors-headers
pip install unidecode

pip install django djangorestframework
python manage.py runserver --settings=core.settings.local

.env
 BACKEND_URL = http://127.0.0.1:8000

NEXT_PUBLIC_BACKEND_URL = http://127.0.0.1:8000
