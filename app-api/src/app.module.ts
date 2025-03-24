import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',         // Type de base de données
      host: 'localhost',     // Hôte de la base de données
      port: 3306,            // Port MySQL (par défaut 3306)
      username: 'root',      // Ton nom d'utilisateur MySQL
      password: 'project9PW!',  // Ton mot de passe MySQL
      database: 'db',   // Nom de la base de données
      entities: [],
      synchronize: true,     // À ne pas activer en production (évite de perdre des données)
    }),
  ],
})
export class AppModule {}