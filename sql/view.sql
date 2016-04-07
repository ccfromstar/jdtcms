DROP VIEW IF EXISTS `view_user_group`;
CREATE VIEW view_user_group
AS
SELECT a.*,b.group_name
FROM wx_user a
LEFT JOIN wx_group b
ON a.groupid = b.group_id;

DROP VIEW IF EXISTS `view_record_user_type`;
CREATE VIEW view_record_user_type
AS
SELECT a.*,b.nickname,c.name
FROM wx_user_record a
LEFT JOIN wx_user b
ON a.wx_openid = b.openid
LEFT JOIN wx_oper_type c
ON a.type_id = c.id;