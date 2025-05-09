
$env:DJANGO_SETTINGS_MODULE="core.settings.local"
python manage.py makemigrations products

.\venv\Scripts\Activate.ps1  
$env:DJANGO_SETTINGS_MODULE="core.settings.local"
python manage.py makemigrations