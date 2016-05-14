DROP VIEW IF EXISTS `view_user_group`;
CREATE VIEW view_user_group
AS
SELECT a.*,b.group_name,c.name
FROM wx_user a
LEFT JOIN wx_group b
ON a.groupid = b.group_id
LEFT JOIN user c
ON a.user_id = c.id;

DROP VIEW IF EXISTS `view_record_user_type_post`;
CREATE VIEW view_record_user_type_post
AS
SELECT a.*,b.nickname,b.groupid,b.remark as wx_remark,b.province,b.city,b.user_id,c.name,d.title
FROM wx_user_record a
LEFT JOIN wx_user b
ON a.wx_openid = b.openid
LEFT JOIN wx_oper_type c
ON a.type_id = c.id
LEFT JOIN post d
ON a.post_id = d.id;

DROP VIEW IF EXISTS `view_score_user_type_post`;
CREATE VIEW view_score_user_type_post
AS
SELECT a.*,b.nickname,b.groupid,b.remark as wx_remark,b.province,b.city,c.name,d.title,e.name as kefu,b.user_id
FROM wx_user_score a
LEFT JOIN wx_user b
ON a.wx_openid = b.openid
LEFT JOIN wx_oper_type c
ON a.type_id = c.id
LEFT JOIN post d
ON a.post_id = d.id
LEFT JOIN user e
ON b.user_id = e.id;

DROP VIEW IF EXISTS `view_redpacket_record_status`;
CREATE VIEW view_redpacket_record_status
AS
SELECT a.*,b.name as sname,c.nickname
FROM redpacket_record a
LEFT JOIN redpacket_type b
ON a.status_id = b.id
LEFT JOIN wx_user c
ON a.openid = c.openid;

DROP VIEW IF EXISTS `view_rp_status`;
CREATE VIEW view_rp_status
AS
SELECT a.*,b.name,c.nickname,c.groupid,c.remark as wx_remark,c.province,c.city,c.user_id
FROM rp_record a
LEFT JOIN rp_type b
ON a.type_id = b.id
LEFT JOIN wx_user c
ON a.openid = c.openid;
