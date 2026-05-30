-- 1. Insertar Especies (si no existen)
INSERT IGNORE INTO especies (nombre) VALUES 
('Conejo'), ('Ave'), ('Roedor'), ('Reptil');

-- 3. Insertar el resto de razas (omitiendo las que ya existan por nombre)
-- PERROS
INSERT IGNORE INTO razas (especies_id, nombre) VALUES 
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Golden Retriever'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Beagle'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Yorkshire Terrier'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Boxer'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Chihuahua'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Podenco'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Galgo'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Border Collie'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Jack Russell Terrier'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Doberman'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Rottweiler'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Setter Inglés'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Cocker Spaniel'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Bichón Maltés'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Shiba Inu'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Pitbull'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Alano Español'),
((SELECT id FROM especies WHERE nombre = 'Perro'), 'Mastín Español');

-- GATOS
INSERT IGNORE INTO razas (especies_id, nombre) VALUES 
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Ragdoll'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Bengala'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'British Shorthair'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Azul Ruso'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Angora Turco'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Exótico de Pelo Corto'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Bosque de Noruega'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Siberiano'),
((SELECT id FROM especies WHERE nombre = 'Gato'), 'Abisinio');

-- CONEJOS
INSERT IGNORE INTO razas (especies_id, nombre) VALUES 
((SELECT id FROM especies WHERE nombre = 'Conejo'), 'Belier'),
((SELECT id FROM especies WHERE nombre = 'Conejo'), 'Cabeza de León'),
((SELECT id FROM especies WHERE nombre = 'Conejo'), 'Enano Holandés'),
((SELECT id FROM especies WHERE nombre = 'Conejo'), 'Rex');
((SELECT id FROM especies WHERE nombre = 'Conejo'), 'Desconocido Conejo');

-- AVES
INSERT IGNORE INTO razas (especies_id, nombre) VALUES 
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Canario'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Periquito'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Ninfa'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Agapornis'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Cacatúa'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Jilguero'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Diamante de Gould'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Yaco (Loro Gris)'),
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Guacamayo');
((SELECT id FROM especies WHERE nombre = 'Ave'), 'Desconocido Ave');


-- ROEDORES
INSERT IGNORE INTO razas (especies_id, nombre) VALUES 
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Hámster Sirio'),
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Hámster Ruso'),
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Hámster Roborowski'),
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Cobaya'),
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Rata Doméstica'),
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Chinchilla'),
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Jerbo'),
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Degú');
((SELECT id FROM especies WHERE nombre = 'Roedor'), 'Desconocido Roedor');

-- REPTILES
INSERT IGNORE INTO razas (especies_id, nombre) VALUES 
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Tortuga de tierra'),
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Tortuga de agua (Galápago)'),
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Dragón Barbudo'),
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Gecko Leopardo'),
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Iguana'),
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Serpiente del Maíz (Corn Snake)'),
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Piton Bola'),
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Camaleón del Yemen');
((SELECT id FROM especies WHERE nombre = 'Reptil'), 'Desconocido Reptil');