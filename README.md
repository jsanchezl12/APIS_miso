# APIS_miso
Este es un repositorio donde se tiene un proyecto asociado a un API construida con Nest js

# Enlaces
  - [Jenkins](http://157.253.238.75:8080/jenkins-misovirtual/)
  - [Sonar](http://157.253.238.75:8080/sonar-misovirtual/)


# Crear un modulo
  nest g mo culturagastronomica

# Crear una entidad
  nest g cl culturagastronomica/culturagastronomica.entity --no-spec

# Crear un servicio
  nest g s culturagastronomica

# Crear un controlador
  nest g co culturagastronomica --no-spec

# Generar un resolver
nest generate resolver culturagastronomica --no-spec
nest generate resolver gastroculture_pais --no-spec
nest generate resolver gastroculture_producto --no-spec
nest generate resolver gastroculture_receta --no-spec
nest generate resolver gastroculture_restaurante --no-spec

# Correr Unitarias
  npm run test

# Levantar proyecto
  npm run start

# Crear Resolver
  nest generate resolver culturagastronomica --no-spec
  
