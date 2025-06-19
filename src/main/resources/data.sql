-- Insert filieres
INSERT INTO filiere (name, academic_year, description, created_at) VALUES
('Génie Informatique', '2024-2025', 'Filière d’ingénierie informatique orientée développement logiciel et systèmes.', NOW()),
('Droit Privé', '2024-2025', 'Filière de droit axée sur le droit civil, commercial et pénal.', NOW());

-- Insert teachers (users + teacher)
INSERT INTO user (email, password_hash, role, created_at) VALUES
('m.alaoui@um5.ac.ma', 'hashedpwd1', 'TEACHER', NOW()),
('s.benbrahim@um5.ac.ma', 'hashedpwd2', 'TEACHER', NOW());
-- Assume: m.alaoui = id 1, s.benbrahim = id 2

INSERT INTO teacher (user_id, first_name, last_name, specialty, created_at) VALUES
(1, 'Mohamed', 'Alaoui', 'Informatique', NOW()),
(2, 'Sanae', 'Benbrahim', 'Droit privé', NOW());

-- Insert 6 modules for Génie Informatique, 1 for Droit Privé
INSERT INTO modulee (name, filiere_id, teacher_id, description, created_at) VALUES
('Programmation Avancée Java', 1, 1, 'Programmation orientée objet et Java avancé.', NOW()),
('Bases de Données Avancées', 1, 1, 'Conception et optimisation des bases de données.', NOW()),
('Développement Web', 1, 1, 'Développement web moderne avec Angular et Spring Boot.', NOW()),
('Systèmes d’Exploitation', 1, 1, 'Concepts avancés des systèmes d’exploitation.', NOW()),
('Réseaux Informatiques', 1, 1, 'Protocoles et architectures réseaux.', NOW()),
('Ingénierie Logicielle', 1, 1, 'Méthodologies de développement logiciel.', NOW()),
('Droit des Contrats', 2, 2, 'Étude approfondie du droit des contrats.', NOW());

-- Insert students (users + student)
INSERT INTO user (email, password_hash, role, created_at) VALUES
('y.elhassani@etu.um5.ac.ma', 'hashedpwd3', 'STUDENT', NOW()),
('f.benali@etu.um5.ac.ma', 'hashedpwd4', 'STUDENT', NOW());
-- Assume: y.elhassani = id 3, f.benali = id 4

INSERT INTO student (user_id, apogee_number, first_name, last_name, filiere_id, created_at) VALUES
(3, '23131', 'Yassine', 'El Hassani', 1, NOW()),
(4, '23132', 'Fatima', 'Benali', 2, NOW());

-- Enroll Yassine in 6 modules, Fatima in 1
INSERT INTO student_module_enrollment (student_user_id, modulee_id, enrollment_date) VALUES
(3, 1, NOW()),
(3, 2, NOW()),
(3, 3, NOW()),
(3, 4, NOW()),
(3, 5, NOW()),
(3, 6, NOW()),
(4, 7, NOW());

-- Insert exams
INSERT INTO exam (modulee_id, title, exam_year, file_url, uploaded_at) VALUES
(1, 'Examen Final - Session Normale', 2024, 'https://exams.um5.ac.ma/java2024.pdf', NOW()),
(2, 'Examen de Rattrapage', 2024, 'https://exams.um5.ac.ma/bd2024_rattrapage.pdf', NOW()),
(3, 'Examen Final', 2024, 'https://exams.um5.ac.ma/web2024.pdf', NOW()),
(4, 'Examen Final', 2024, 'https://exams.um5.ac.ma/os2024.pdf', NOW()),
(5, 'Examen Final', 2024, 'https://exams.um5.ac.ma/reseaux2024.pdf', NOW()),
(6, 'Examen Final', 2024, 'https://exams.um5.ac.ma/ingenierie2024.pdf', NOW()),
(7, 'Examen Final', 2024, 'https://exams.um5.ac.ma/droit2024.pdf', NOW());

-- Insert messages (module chat)
INSERT INTO message (modulee_id, sender_user_id, content, sent_at) VALUES
(1, 1, 'Bonjour à tous, le prochain cours aura lieu lundi à 10h.', NOW()),
(1, 3, 'Merci Professeur, j’ai une question sur le TP.', NOW()),
(2, 1, 'N\'oubliez pas de rendre vos projets avant vendredi.', NOW()),
(3, 1, 'Le support de cours est disponible sur la plateforme.', NOW()),
(7, 2, 'Le prochain TD aura lieu jeudi.', NOW());

-- Done!
