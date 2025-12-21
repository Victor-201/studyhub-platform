USE document_db;

-- ==================================================================
-- SEED DOCUMENTS (ACADEMIC PLATFORM)
-- ==================================================================
INSERT INTO documents (id, owner_id, title, description, visibility, storage_path) VALUES
-- user1
('1111-0001-4111-8111-aaaaaaaa0001','11111111-2222-4222-8222-111111111112',
'Foundations of Linear Algebra',
'This document provides a structured and in-depth introduction to linear algebra, including vectors, matrices, systems of linear equations, determinants, eigenvalues, and eigenvectors. The material is designed for undergraduate students in mathematics, engineering, and computer science.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1111-0002-4111-8111-aaaaaaaa0002','11111111-2222-4222-8222-111111111112',
'Classical Physics: Mechanics',
'An academic lecture document covering Newtonian mechanics, including kinematics, laws of motion, work-energy theorem, momentum, and rotational dynamics, supported by solved examples and conceptual explanations.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1111-0003-4111-8111-aaaaaaaa0003','11111111-2222-4222-8222-111111111112',
'Advanced Linear Algebra and Applications',
'This group-shared document explores advanced linear algebra topics such as vector spaces, inner product spaces, spectral theorem, matrix factorization, and applications in machine learning and data analysis.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user2
('1112-0001-4111-8111-aaaaaaaa0004','11111111-2222-4222-8222-111111111113',
'General Chemistry I',
'A comprehensive introduction to general chemistry, covering atomic structure, periodic trends, chemical bonding, stoichiometry, and fundamental reaction types.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1112-0002-4111-8111-aaaaaaaa0005','11111111-2222-4222-8222-111111111113',
'Chemical Laboratory Safety Guidelines',
'A private reference document describing laboratory safety rules, hazard symbols, chemical handling procedures, and waste disposal standards used in academic laboratories.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1112-0003-4111-8111-aaaaaaaa0006','11111111-2222-4222-8222-111111111113',
'Chemical Thermodynamics',
'This group document explains thermodynamic principles applied to chemistry, including the first and second laws, entropy, enthalpy, Gibbs free energy, and chemical equilibrium.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user3
('1113-0001-4111-8111-aaaaaaaa0007','11111111-2222-4222-8222-111111111114',
'Cell Biology Fundamentals',
'An academic overview of cell biology, focusing on cell structure, membranes, organelles, cell signaling pathways, and the cell cycle.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1113-0002-4111-8111-aaaaaaaa0008','11111111-2222-4222-8222-111111111114',
'Biological Research Techniques',
'A private document describing experimental methods in biology, including microscopy, molecular techniques, data analysis, and laboratory best practices.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1113-0003-4111-8111-aaaaaaaa0009','11111111-2222-4222-8222-111111111114',
'Molecular Biology and Genetics',
'This group-shared document focuses on DNA structure, replication, transcription, translation, gene regulation, and fundamental genetic mechanisms.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user4
('1114-0001-4111-8111-aaaaaaaa0010','11111111-2222-4222-8222-111111111115',
'World History: Ancient to Medieval Periods',
'A survey document examining major ancient and medieval civilizations, their political systems, cultures, and historical influence.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1114-0002-4111-8111-aaaaaaaa0011','11111111-2222-4222-8222-111111111115',
'Historical Research Methodology',
'A private academic guide covering historical research methods, primary and secondary sources, citation standards, and academic writing.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1114-0003-4111-8111-aaaaaaaa0012','11111111-2222-4222-8222-111111111115',
'Modern World History and Global Conflicts',
'This group document analyzes major global conflicts of the modern era, including world wars, cold war dynamics, and geopolitical consequences.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user5
('1115-0001-4111-8111-aaaaaaaa0013','11111111-2222-4222-8222-111111111116',
'Introduction to World Literature',
'An academic introduction to world literature, covering major literary movements, genres, and representative authors.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1115-0002-4111-8111-aaaaaaaa0014','11111111-2222-4222-8222-111111111116',
'Literary Analysis Techniques',
'A private document presenting methods for analyzing literary texts, including narrative structure, themes, symbolism, and critical theory.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1115-0003-4111-8111-aaaaaaaa0015','11111111-2222-4222-8222-111111111116',
'Comparative Literature Studies',
'This group document compares literary works across cultures and historical periods, emphasizing cross-cultural interpretation.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user6
('1116-0001-4111-8111-aaaaaaaa0016','11111111-2222-4222-8222-111111111117',
'Introduction to Programming',
'A beginner-friendly academic document covering programming fundamentals such as variables, control structures, functions, and basic algorithms.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1116-0002-4111-8111-aaaaaaaa0017','11111111-2222-4222-8222-111111111117',
'Data Structures and Algorithms',
'A private document discussing core data structures, algorithmic complexity, and problem-solving strategies.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1116-0003-4111-8111-aaaaaaaa0018','11111111-2222-4222-8222-111111111117',
'Software Engineering Principles',
'This group document introduces software development life cycles, design patterns, testing strategies, and collaborative development.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user7
('1117-0001-4111-8111-aaaaaaaa0019','11111111-2222-4222-8222-111111111118',
'Artificial Intelligence Fundamentals',
'An introductory document explaining core concepts of artificial intelligence, including search algorithms, knowledge representation, and reasoning.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1117-0002-4111-8111-aaaaaaaa0020','11111111-2222-4222-8222-111111111118',
'Ethics in Artificial Intelligence',
'A private academic discussion on ethical challenges in AI, including bias, fairness, transparency, and social impact.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1117-0003-4111-8111-aaaaaaaa0021','11111111-2222-4222-8222-111111111118',
'Applied Artificial Intelligence',
'This group document focuses on real-world AI applications such as natural language processing, computer vision, and recommendation systems.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user8
('1118-0001-4111-8111-aaaaaaaa0022','11111111-2222-4222-8222-111111111119',
'Machine Learning Basics',
'A foundational academic document introducing supervised and unsupervised learning, regression, classification, and evaluation metrics.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1118-0002-4111-8111-aaaaaaaa0023','11111111-2222-4222-8222-111111111119',
'Deep Learning Architectures',
'A private document discussing neural networks, convolutional networks, recurrent networks, and training techniques.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1118-0003-4111-8111-aaaaaaaa0024','11111111-2222-4222-8222-111111111119',
'Machine Learning Applications',
'This group document explores machine learning use cases in healthcare, finance, education, and scientific research.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user9
('1119-0001-4111-8111-aaaaaaaa0025','11111111-2222-4222-8222-111111111120',
'Introduction to Academic Writing',
'A guide for students on academic writing, covering structure, clarity, citation styles, and plagiarism avoidance.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1119-0002-4111-8111-aaaaaaaa0026','11111111-2222-4222-8222-111111111120',
'Research Proposal Development',
'A private document explaining how to formulate research questions, design methodologies, and write effective proposals.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1119-0003-4111-8111-aaaaaaaa0027','11111111-2222-4222-8222-111111111120',
'Scientific Research Methodology',
'This group document discusses quantitative and qualitative research methods, data collection, and analysis techniques.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

-- user10
('1120-0001-4111-8111-aaaaaaaa0028','11111111-2222-4222-8222-111111111121',
'Foundations of Higher Education',
'An overview document discussing the structure of higher education systems, learning outcomes, and academic standards.',
'PUBLIC','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1120-0002-4111-8111-aaaaaaaa0029','11111111-2222-4222-8222-111111111121',
'University Teaching and Assessment',
'A private academic resource focusing on teaching methodologies, assessment strategies, and student evaluation.',
'PRIVATE','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx'),

('1120-0003-4111-8111-aaaaaaaa0030','11111111-2222-4222-8222-111111111121',
'Academic Quality Assurance',
'This group document examines quality assurance frameworks, accreditation processes, and continuous improvement in education.',
'GROUP','https://res.cloudinary.com/dvzdkwmzn/raw/upload/v1765695436/documents/document_4cd6d7df-d314-4229-a296-54dcfc543556.pptx');

-- ==================================================================
-- SEED GROUP DOCUMENTS (only GROUP visibility)
-- ==================================================================
INSERT INTO group_documents (id, group_id, document_id, status, submitted_by, reviewed_by) VALUES
-- Group Alpha
('0001-aaaa-4111-8111-aaaaaaa10001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1111-0003-4111-8111-aaaaaaaa0003', 'APPROVED', '11111111-2222-4222-8222-111111111112', '11111111-2222-4222-8222-111111111113'),
('0002-aaaa-4111-8111-aaaaaaa10002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1112-0003-4111-8111-aaaaaaaa0006', 'APPROVED', '11111111-2222-4222-8222-111111111113', NULL),
('0003-aaaa-4111-8111-aaaaaaa10003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1113-0003-4111-8111-aaaaaaaa0009', 'APPROVED', '11111111-2222-4222-8222-111111111114', '11111111-2222-4222-8222-111111111112'),
('0004-aaaa-4111-8111-aaaaaaa10004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1114-0003-4111-8111-aaaaaaaa0012', 'APPROVED', '11111111-2222-4222-8222-111111111115', NULL),

-- Group Beta
('0005-bbbb-4111-8111-aaaaaaa10005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1115-0003-4111-8111-aaaaaaaa0015', 'APPROVED', '11111111-2222-4222-8222-111111111116', NULL),
('0006-bbbb-4111-8111-aaaaaaa10006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1116-0003-4111-8111-aaaaaaaa0018', 'APPROVED', '11111111-2222-4222-8222-111111111117', NULL),
('0007-bbbb-4111-8111-aaaaaaa10007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1117-0003-4111-8111-aaaaaaaa0021', 'APPROVED', '11111111-2222-4222-8222-111111111118', NULL),
('0008-bbbb-4111-8111-aaaaaaa10008', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1118-0003-4111-8111-aaaaaaaa0024', 'APPROVED', '11111111-2222-4222-8222-111111111119', NULL),
('0009-bbbb-4111-8111-aaaaaaa10009', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1119-0003-4111-8111-aaaaaaaa0027', 'APPROVED', '11111111-2222-4222-8222-111111111120', NULL),
('0010-bbbb-4111-8111-aaaaaaa10010', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1120-0003-4111-8111-aaaaaaaa0030', 'APPROVED', '11111111-2222-4222-8222-111111111121', NULL);

-- ==================================================================
-- SEED DOCUMENT TAGS
-- ==================================================================
INSERT INTO document_tags (document_id, tag) VALUES
('1111-0001-4111-8111-aaaaaaaa0001', 'math'),
('1111-0001-4111-8111-aaaaaaaa0001', 'algebra'),
('1111-0002-4111-8111-aaaaaaaa0002', 'physics'),
('1112-0001-4111-8111-aaaaaaaa0004', 'chemistry'),
('1113-0001-4111-8111-aaaaaaaa0007', 'biology'),
('1114-0001-4111-8111-aaaaaaaa0010', 'history'),
('1115-0001-4111-8111-aaaaaaaa0013', 'literature'),
('1116-0001-4111-8111-aaaaaaaa0016', 'programming'),
('1117-0001-4111-8111-aaaaaaaa0019', 'ai'),
('1118-0001-4111-8111-aaaaaaaa0022', 'machine-learning');

-- ==================================================================
-- SEED DOCUMENT BOOKMARKS
-- ==================================================================
INSERT INTO document_bookmarks (document_id, user_id) VALUES
('1111-0001-4111-8111-aaaaaaaa0001', '11111111-2222-4222-8222-111111111113'),
('1111-0002-4111-8111-aaaaaaaa0002', '11111111-2222-4222-8222-111111111114'),
('1112-0001-4111-8111-aaaaaaaa0004', '11111111-2222-4222-8222-111111111112'),
('1113-0001-4111-8111-aaaaaaaa0007', '11111111-2222-4222-8222-111111111115');

-- ==================================================================
-- SEED DOCUMENT COMMENTS
-- ==================================================================
INSERT INTO document_comments (id, document_id, user_id, content, parent_comment_id) VALUES
('c0001-1111-4111-8111-aaaaaaaa001','1111-0001-4111-8111-aaaaaaaa0001','11111111-2222-4222-8222-111111111113',
'The explanations in this document are clear and logically structured. It is very helpful for students encountering linear algebra for the first time.',NULL),

('c0002-1111-4111-8111-aaaaaaaa002','1111-0001-4111-8111-aaaaaaaa0001','11111111-2222-4222-8222-111111111114',
'I particularly appreciate the examples related to eigenvalues and their practical applications.', 'c0001-1111-4111-8111-aaaaaaaa001'),

('c0003-1112-4111-8111-aaaaaaaa003','1112-0001-4111-8111-aaaaaaaa0004','11111111-2222-4222-8222-111111111112',
'A well-structured introduction to chemistry. The explanations align well with standard university curricula.',NULL);


-- ==================================================================
-- SEED DOCUMENT DOWNLOADS
-- ==================================================================
INSERT INTO document_downloads (document_id, user_id) VALUES
('1111-0001-4111-8111-aaaaaaaa0001', '11111111-2222-4222-8222-111111111114'),
('1111-0002-4111-8111-aaaaaaaa0002', '11111111-2222-4222-8222-111111111115'),
('1112-0001-4111-8111-aaaaaaaa0004', '11111111-2222-4222-8222-111111111116');
