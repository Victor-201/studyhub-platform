USE document_db;

INSERT INTO documents (id, owner_id, title, description, visibility, storage_path) VALUES
-- user1
('1111-0001-4111-8111-aaaaaaaa0001', '11111111-2222-4222-8222-111111111112', 'Doc 1 User1', 'User 1 document 1', 'PUBLIC', '/storage/doc1-u1.pdf'),
('1111-0002-4111-8111-aaaaaaaa0002', '11111111-2222-4222-8222-111111111112', 'Doc 2 User1', 'User 1 document 2', 'PUBLIC', '/storage/doc2-u1.pdf'),
('1111-0003-4111-8111-aaaaaaaa0003', '11111111-2222-4222-8222-111111111112', 'Doc 3 User1', 'User 1 document 3', 'PRIVATE', '/storage/doc3-u1.pdf'),

-- user2
('1112-0001-4111-8111-aaaaaaaa0004', '11111111-2222-4222-8222-111111111113', 'Doc 1 User2', 'User 2 document 1', 'PUBLIC', '/storage/doc1-u2.pdf'),
('1112-0002-4111-8111-aaaaaaaa0005', '11111111-2222-4222-8222-111111111113', 'Doc 2 User2', 'User 2 document 2', 'PRIVATE', '/storage/doc2-u2.pdf'),
('1112-0003-4111-8111-aaaaaaaa0006', '11111111-2222-4222-8222-111111111113', 'Doc 3 User2', 'User 2 document 3', 'GROUP', '/storage/doc3-u2.pdf'),

-- user3
('1113-0001-4111-8111-aaaaaaaa0007', '11111111-2222-4222-8222-111111111114', 'Doc 1 User3', 'User 3 document 1', 'PUBLIC', '/storage/doc1-u3.pdf'),
('1113-0002-4111-8111-aaaaaaaa0008', '11111111-2222-4222-8222-111111111114', 'Doc 2 User3', 'User 3 document 2', 'PRIVATE', '/storage/doc2-u3.pdf'),
('1113-0003-4111-8111-aaaaaaaa0009', '11111111-2222-4222-8222-111111111114', 'Doc 3 User3', 'User 3 document 3', 'GROUP', '/storage/doc3-u3.pdf'),

-- user4
('1114-0001-4111-8111-aaaaaaaa0010', '11111111-2222-4222-8222-111111111115', 'Doc 1 User4', 'User 4 document 1', 'PUBLIC', '/storage/doc1-u4.pdf'),
('1114-0002-4111-8111-aaaaaaaa0011', '11111111-2222-4222-8222-111111111115', 'Doc 2 User4', 'User 4 document 2', 'PRIVATE', '/storage/doc2-u4.pdf'),
('1114-0003-4111-8111-aaaaaaaa0012', '11111111-2222-4222-8222-111111111115', 'Doc 3 User4', 'User 4 document 3', 'GROUP', '/storage/doc3-u4.pdf'),

-- user5
('1115-0001-4111-8111-aaaaaaaa0013', '11111111-2222-4222-8222-111111111116', 'Doc 1 User5', 'User 5 document 1', 'PUBLIC', '/storage/doc1-u5.pdf'),
('1115-0002-4111-8111-aaaaaaaa0014', '11111111-2222-4222-8222-111111111116', 'Doc 2 User5', 'User 5 document 2', 'PRIVATE', '/storage/doc2-u5.pdf'),
('1115-0003-4111-8111-aaaaaaaa0015', '11111111-2222-4222-8222-111111111116', 'Doc 3 User5', 'User 5 document 3', 'GROUP', '/storage/doc3-u5.pdf'),

-- user6
('1116-0001-4111-8111-aaaaaaaa0016', '11111111-2222-4222-8222-111111111117', 'Doc 1 User6', 'User 6 document 1', 'PUBLIC', '/storage/doc1-u6.pdf'),
('1116-0002-4111-8111-aaaaaaaa0017', '11111111-2222-4222-8222-111111111117', 'Doc 2 User6', 'User 6 document 2', 'PRIVATE', '/storage/doc2-u6.pdf'),
('1116-0003-4111-8111-aaaaaaaa0018', '11111111-2222-4222-8222-111111111117', 'Doc 3 User6', 'User 6 document 3', 'GROUP', '/storage/doc3-u6.pdf'),

-- user7
('1117-0001-4111-8111-aaaaaaaa0019', '11111111-2222-4222-8222-111111111118', 'Doc 1 User7', 'User 7 document 1', 'PUBLIC', '/storage/doc1-u7.pdf'),
('1117-0002-4111-8111-aaaaaaaa0020', '11111111-2222-4222-8222-111111111118', 'Doc 2 User7', 'User 7 document 2', 'PRIVATE', '/storage/doc2-u7.pdf'),
('1117-0003-4111-8111-aaaaaaaa0021', '11111111-2222-4222-8222-111111111118', 'Doc 3 User7', 'User 7 document 3', 'GROUP', '/storage/doc3-u7.pdf'),

-- user8
('1118-0001-4111-8111-aaaaaaaa0022', '11111111-2222-4222-8222-111111111119', 'Doc 1 User8', 'User 8 document 1', 'PUBLIC', '/storage/doc1-u8.pdf'),
('1118-0002-4111-8111-aaaaaaaa0023', '11111111-2222-4222-8222-111111111119', 'Doc 2 User8', 'User 8 document 2', 'PRIVATE', '/storage/doc2-u8.pdf'),
('1118-0003-4111-8111-aaaaaaaa0024', '11111111-2222-4222-8222-111111111119', 'Doc 3 User8', 'User 8 document 3', 'GROUP', '/storage/doc3-u8.pdf'),

-- user9
('1119-0001-4111-8111-aaaaaaaa0025', '11111111-2222-4222-8222-111111111120', 'Doc 1 User9', 'User 9 document 1', 'PUBLIC', '/storage/doc1-u9.pdf'),
('1119-0002-4111-8111-aaaaaaaa0026', '11111111-2222-4222-8222-111111111120', 'Doc 2 User9', 'User 9 document 2', 'PRIVATE', '/storage/doc2-u9.pdf'),
('1119-0003-4111-8111-aaaaaaaa0027', '11111111-2222-4222-8222-111111111120', 'Doc 3 User9', 'User 9 document 3', 'GROUP', '/storage/doc3-u9.pdf'),

-- user10
('1120-0001-4111-8111-aaaaaaaa0028', '11111111-2222-4222-8222-111111111121', 'Doc 1 User10', 'User 10 document 1', 'PUBLIC', '/storage/doc1-u10.pdf'),
('1120-0002-4111-8111-aaaaaaaa0029', '11111111-2222-4222-8222-111111111121', 'Doc 2 User10', 'User 10 document 2', 'PRIVATE', '/storage/doc2-u10.pdf'),
('1120-0003-4111-8111-aaaaaaaa0030', '11111111-2222-4222-8222-111111111121', 'Doc 3 User10', 'User 10 document 3', 'GROUP', '/storage/doc3-u10.pdf');


-- ==================================================================
-- SEED GROUP DOCUMENTS — ID FIXED (remove gdoc- prefix)
-- ==================================================================

-- Group Alpha
INSERT INTO group_documents (id, group_id, document_id, status, submitted_by, reviewed_by) VALUES
('0001-aaaa-4111-8111-aaaaaaa10001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1111-0001-4111-8111-aaaaaaaa0001', 'APPROVED', '11111111-2222-4222-8222-111111111112', '11111111-2222-4222-8222-111111111113'),
('0002-aaaa-4111-8111-aaaaaaa10002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1111-0002-4111-8111-aaaaaaaa0002', 'PENDING',  '11111111-2222-4222-8222-111111111112', NULL),
('0003-aaaa-4111-8111-aaaaaaa10003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1112-0001-4111-8111-aaaaaaaa0004', 'REJECTED', '11111111-2222-4222-8222-111111111113', '11111111-2222-4222-8222-111111111112'),
('0004-aaaa-4111-8111-aaaaaaa10004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1113-0001-4111-8111-aaaaaaaa0007', 'APPROVED', '11111111-2222-4222-8222-111111111114', '11111111-2222-4222-8222-111111111112'),
('0005-aaaa-4111-8111-aaaaaaa10005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1114-0001-4111-8111-aaaaaaaa0010', 'PENDING',  '11111111-2222-4222-8222-111111111115', NULL);


-- Group Beta
INSERT INTO group_documents (id, group_id, document_id, status, submitted_by, reviewed_by) VALUES
('0006-bbbb-4111-8111-aaaaaaa10006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1112-0002-4111-8111-aaaaaaaa0005', 'APPROVED', '11111111-2222-4222-8222-111111111113', '11111111-2222-4222-8222-111111111114'),
('0007-bbbb-4111-8111-aaaaaaa10007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1113-0002-4111-8111-aaaaaaaa0008', 'PENDING',  '11111111-2222-4222-8222-111111111114', NULL),
('0008-bbbb-4111-8111-aaaaaaa10008', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1114-0002-4111-8111-aaaaaaaa0011', 'REJECTED', '11111111-2222-4222-8222-111111111115', '11111111-2222-4222-8222-111111111113'),
('0009-bbbb-4111-8111-aaaaaaa10009', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1115-0002-4111-8111-aaaaaaaa0014', 'APPROVED', '11111111-2222-4222-8222-111111111116', '11111111-2222-4222-8222-111111111113'),
('0010-bbbb-4111-8111-aaaaaaa10010', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '1116-0002-4111-8111-aaaaaaaa0017', 'PENDING',  '11111111-2222-4222-8222-111111111117', NULL);
