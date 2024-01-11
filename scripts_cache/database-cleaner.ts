import { createConnection } from 'typeorm';
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata';
import { CulturagastronomicaEntity } from '../src/culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../src/producto/producto.entity';
import { RecetaEntity } from '../src/receta/receta.entity';
import { IngredienteEntity } from '../src/ingrediente/ingrediente.entity';
import { RestauranteEntity } from '../src/restaurante/restaurante.entity';
import { PaisEntity } from '../src/pais/pais.entity';
import { RegionEntity } from '../src/region/region.entity';

async function cleanDatabase() {
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
        CulturagastronomicaEntity,
        ProductoEntity,
        RecetaEntity,
        IngredienteEntity,
        RestauranteEntity,
        PaisEntity,
        RegionEntity,
      ],
      synchronize: true,
      logging: true,
    });

    const entities = connection.entityMetadatas;

    // Borrar en orden inverso para respetar restricciones de clave externa
    for (let i = entities.length - 1; i >= 0; i--) {
      const entity: EntityMetadata = entities[i];
      await connection.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
      console.log(
        `Registros de la tabla ${entity.name} borrados exitosamente.`,
      );
    }

    console.log('Base de datos limpiada exitosamente.');
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  }
}

cleanDatabase();
