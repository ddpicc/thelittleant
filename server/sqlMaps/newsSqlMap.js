var sqlMap = {
	getAllNews: 'SELECT * FROM littleAnt_newslist order by id desc',
	getNewsById: 'SELECT * FROM littleAnt_newslist WHERE id = ?',
	deleteNewsById: 'DELETE FROM littleAnt_newslist where id = ?',

	createNews: 'INSERT INTO littleAnt_newslist(title,summary,content,created_at,stay_top,to_storageNm) VALUES(?,?,?,?,?,?)',
	updateNews: 'UPDATE littleAnt_newslist SET title = ?, summary = ?, content = ?,update_at = ?,stay_top = ?,to_storageNm = ? WHERE id = ?',
}
module.exports = sqlMap;