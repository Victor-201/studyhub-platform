USE document_db;

-- ==================================================================
-- SEED DOCUMENTS (ACADEMIC PLATFORM)
-- ==================================================================
INSERT INTO documents
(id, owner_id, title, description, visibility, file_name, storage_path)
VALUES
-- user1
('1111-0001-4111-8111-aaaaaaaa0001','11111111-2222-4222-8222-111111111112',
'Foundations of Linear Algebra',
'This document provides a structured and in-depth introduction to linear algebra, including vectors, matrices, systems of linear equations, determinants, eigenvalues, and eigenvectors.',
'PUBLIC',
'Foundations_of_Linear_Algebra.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767680028/documents/document_c5d24333-181d-4429-83cd-eadfcc68de67.pptx'),

('1111-0002-4111-8111-aaaaaaaa0002','11111111-2222-4222-8222-111111111112',
'Classical Physics: Mechanics',
'An academic lecture document covering Newtonian mechanics.',
'PUBLIC',
'Classical_Physics_Mechanics.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767680028/documents/document_c5d24333-181d-4429-83cd-eadfcc68de67.pptx'),

('1111-0003-4111-8111-aaaaaaaa0003','11111111-2222-4222-8222-111111111112',
'Advanced Linear Algebra and Applications',
'Advanced linear algebra topics with applications in ML.',
'GROUP',
'Advanced_Linear_Algebra_Applications.docx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767680159/documents/document_81e4debb-6cae-40d3-a04a-cb5de88aa8aa.docx'),

-- user2
('1112-0001-4111-8111-aaaaaaaa0004','11111111-2222-4222-8222-111111111113',
'General Chemistry I',
'Introduction to general chemistry.',
'PUBLIC',
'General_Chemistry_I.docx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767680159/documents/document_81e4debb-6cae-40d3-a04a-cb5de88aa8aa.docx'),

('1112-0002-4111-8111-aaaaaaaa0005','11111111-2222-4222-8222-111111111113',
'Chemical Laboratory Safety Guidelines',
'Laboratory safety rules.',
'PRIVATE',
'Chemical_Lab_Safety_Guidelines.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1112-0003-4111-8111-aaaaaaaa0006','11111111-2222-4222-8222-111111111113',
'Chemical Thermodynamics',
'Thermodynamic principles.',
'GROUP',
'Chemical_Thermodynamics.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user3
('1113-0001-4111-8111-aaaaaaaa0007','11111111-2222-4222-8222-111111111114',
'Cell Biology Fundamentals',
'Overview of cell biology.',
'PUBLIC',
'Cell_Biology_Fundamentals.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1113-0002-4111-8111-aaaaaaaa0008','11111111-2222-4222-8222-111111111114',
'Biological Research Techniques',
'Experimental methods in biology.',
'PRIVATE',
'Biological_Research_Techniques.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1113-0003-4111-8111-aaaaaaaa0009','11111111-2222-4222-8222-111111111114',
'Molecular Biology and Genetics',
'Genetics fundamentals.',
'GROUP',
'Molecular_Biology_and_Genetics.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user4
('1114-0001-4111-8111-aaaaaaaa0010','11111111-2222-4222-8222-111111111115',
'World History: Ancient to Medieval Periods',
'Survey of ancient history.',
'PUBLIC',
'World_History_Ancient_Medieval.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1114-0002-4111-8111-aaaaaaaa0011','11111111-2222-4222-8222-111111111115',
'Historical Research Methodology',
'Research methods.',
'PRIVATE',
'Historical_Research_Methodology.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1114-0003-4111-8111-aaaaaaaa0012','11111111-2222-4222-8222-111111111115',
'Modern World History and Global Conflicts',
'Modern conflicts.',
'GROUP',
'Modern_World_History_Conflicts.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user5
('1115-0001-4111-8111-aaaaaaaa0013','11111111-2222-4222-8222-111111111116',
'Introduction to World Literature',
'World literature overview.',
'PUBLIC',
'Introduction_to_World_Literature.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1115-0002-4111-8111-aaaaaaaa0014','11111111-2222-4222-8222-111111111116',
'Literary Analysis Techniques',
'Analysis methods.',
'PRIVATE',
'Literary_Analysis_Techniques.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1115-0003-4111-8111-aaaaaaaa0015','11111111-2222-4222-8222-111111111116',
'Comparative Literature Studies',
'Comparative studies.',
'GROUP',
'Comparative_Literature_Studies.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user6
('1116-0001-4111-8111-aaaaaaaa0016','11111111-2222-4222-8222-111111111117',
'Introduction to Programming',
'Programming basics.',
'PUBLIC',
'Introduction_to_Programming.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1116-0002-4111-8111-aaaaaaaa0017','11111111-2222-4222-8222-111111111117',
'Data Structures and Algorithms',
'Core DS & Algo.',
'PRIVATE',
'Data_Structures_and_Algorithms.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1116-0003-4111-8111-aaaaaaaa0018','11111111-2222-4222-8222-111111111117',
'Software Engineering Principles',
'SE principles.',
'GROUP',
'Software_Engineering_Principles.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user7
('1117-0001-4111-8111-aaaaaaaa0019','11111111-2222-4222-8222-111111111118',
'Artificial Intelligence Fundamentals',
'AI basics.',
'PUBLIC',
'AI_Fundamentals.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1117-0002-4111-8111-aaaaaaaa0020','11111111-2222-4222-8222-111111111118',
'Ethics in Artificial Intelligence',
'AI ethics.',
'PRIVATE',
'Ethics_in_AI.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1117-0003-4111-8111-aaaaaaaa0021','11111111-2222-4222-8222-111111111118',
'Applied Artificial Intelligence',
'Applied AI.',
'GROUP',
'Applied_AI.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user8
('1118-0001-4111-8111-aaaaaaaa0022','11111111-2222-4222-8222-111111111119',
'Machine Learning Basics',
'ML basics.',
'PUBLIC',
'Machine_Learning_Basics.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1118-0002-4111-8111-aaaaaaaa0023','11111111-2222-4222-8222-111111111119',
'Deep Learning Architectures',
'DL architectures.',
'PRIVATE',
'Deep_Learning_Architectures.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1118-0003-4111-8111-aaaaaaaa0024','11111111-2222-4222-8222-111111111119',
'Machine Learning Applications',
'ML applications.',
'GROUP',
'Machine_Learning_Applications.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user9
('1119-0001-4111-8111-aaaaaaaa0025','11111111-2222-4222-8222-111111111120',
'Introduction to Academic Writing',
'Academic writing guide.',
'PUBLIC',
'Introduction_to_Academic_Writing.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1119-0002-4111-8111-aaaaaaaa0026','11111111-2222-4222-8222-111111111120',
'Research Proposal Development',
'Proposal writing.',
'PRIVATE',
'Research_Proposal_Development.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1119-0003-4111-8111-aaaaaaaa0027','11111111-2222-4222-8222-111111111120',
'Scientific Research Methodology',
'Research methods.',
'GROUP',
'Scientific_Research_Methodology.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

-- user10
('1120-0001-4111-8111-aaaaaaaa0028','11111111-2222-4222-8222-111111111121',
'Foundations of Higher Education',
'Higher education overview.',
'PUBLIC',
'Foundations_of_Higher_Education.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1120-0002-4111-8111-aaaaaaaa0029','11111111-2222-4222-8222-111111111121',
'University Teaching and Assessment',
'Teaching & assessment.',
'PRIVATE',
'University_Teaching_and_Assessment.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx'),

('1120-0003-4111-8111-aaaaaaaa0030','11111111-2222-4222-8222-111111111121',
'Academic Quality Assurance',
'Quality assurance.',
'GROUP',
'Academic_Quality_Assurance.pptx',
'https://res.cloudinary.com/drfbrvvug/raw/upload/v1767679336/documents/document_7b5a7802-ace2-4aca-8a54-38a958cad7bc.pptx');

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
INSERT INTO document_downloads (id, document_id, user_id) VALUES
('8a111111-0001-4111-8111-akadsaaa0001', '1111-0001-4111-8111-aaaaaaaa0001', '11111111-2222-4222-8222-111111111114'),
('8a111111-0002-4111-8111-akadsaaa0002', '1111-0002-4111-8111-aaaaaaaa0002', '11111111-2222-4222-8222-111111111115'),
('8a111111-0004-4111-8111-akadsaaa0004', '1112-0001-4111-8111-aaaaaaaa0004', '11111111-2222-4222-8222-111111111116');
-- 