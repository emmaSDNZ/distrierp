
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

pip install django djangorestframework
python manage.py runserver --settings=core.settings.local
