DROP VIEW IF EXISTS `view_user_group`;
CREATE VIEW view_user_group
AS
SELECT a.*,b.group_name
FROM wx_user a
LEFT JOIN wx_group b
ON a.groupid = b.group_id;

DROP VIEW IF EXISTS `view_record_user_type_post`;
CREATE VIEW view_record_user_type_post
AS
SELECT a.*,b.nickname,c.name,d.title
FROM wx_user_record a
LEFT JOIN wx_user b
ON a.wx_openid = b.openid
LEFT JOIN wx_oper_type c
ON a.type_id = c.id
LEFT JOIN post d
ON a.post_id = d.id;