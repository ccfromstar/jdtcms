DROP VIEW IF EXISTS `view_user_group`;
CREATE VIEW view_user_group
AS
SELECT a.*,b.group_name
FROM wx_user a
LEFT JOIN wx_group b
ON a.groupid = b.group_id;