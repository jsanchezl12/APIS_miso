import { createConnection } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CulturagastronomicaEntity } from '../src/culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../src/producto/producto.entity';
import { RecetaEntity } from '../src/receta/receta.entity';
import { IngredienteEntity } from '../src/ingrediente/ingrediente.entity';
import { RestauranteEntity } from '../src/restaurante/restaurante.entity';
import { PaisEntity } from '../src/pais/pais.entity';
import { RegionEntity } from '../src/region/region.entity';

async function seedDatabase() {
  try {
    // Crear la conexión principal con opciones específicas
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'gastroapidb',
      entities: [
        ProductoEntity,
        IngredienteEntity,
        RestauranteEntity,
        PaisEntity,
        RegionEntity,
        CulturagastronomicaEntity,
        RecetaEntity,
      ],
      synchronize: true,
      logging: true,
    });

    const entities = connection.entityMetadatas;

    for (const entity of entities) {
      await connection.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
      console.log(
        `Registros de la tabla ${entity.name} borrados exitosamente.`,
      );
    }

    // Array con los nombres de los archivos SQL que se desean cargar
    const sqlFileNames = [
      'producto_inserts.sql',
      'pais_inserts.sql',
      'region_inserts.sql',
      'ingrediente_entity.sql',
      'restaurante_entity.sql',
      'gastroculture_inserts.sql',
      'receta_inserts.sql',
    ];

    for (const fileName of sqlFileNames) {
      const sqlFilePath = path.join(__dirname, 'sql_inserts', fileName);
      const sqlContent = await fs.readFile(sqlFilePath, 'utf-8');
      await connection.query(sqlContent);
      console.log(`Archivo ${fileName} cargado exitosamente.`);
    }

    console.log('Base de datos poblada exitosamente.');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  }
}

seedDatabase();
