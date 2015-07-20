
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (InspirationBoardNew == null) var InspirationBoardNew = {};
InspirationBoardNew._path = '/dwr';
InspirationBoardNew.getBoards = function(callback) {
  dwr.engine._execute(InspirationBoardNew._path, 'InspirationBoardNew', 'getBoards', callback);
}
InspirationBoardNew.addPhoto = function(p0, p1, callback) {
  dwr.engine._execute(InspirationBoardNew._path, 'InspirationBoardNew', 'addPhoto', p0, p1, callback);
}
InspirationBoardNew.saveBoard = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(InspirationBoardNew._path, 'InspirationBoardNew', 'saveBoard', p0, p1, p2, p3, callback);
}
InspirationBoardNew.updateBoardDetails = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(InspirationBoardNew._path, 'InspirationBoardNew', 'updateBoardDetails', p0, p1, p2, p3, callback);
}
InspirationBoardNew.getRecentUsedPhotos = function(callback) {
  dwr.engine._execute(InspirationBoardNew._path, 'InspirationBoardNew', 'getRecentUsedPhotos', callback);
}
InspirationBoardNew.getAllUsedPhotos = function(p0, callback) {
  dwr.engine._execute(InspirationBoardNew._path, 'InspirationBoardNew', 'getAllUsedPhotos', p0, callback);
}
InspirationBoardNew.createBoardAddPhoto = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(InspirationBoardNew._path, 'InspirationBoardNew', 'createBoardAddPhoto', p0, p1, p2, p3, p4, callback);
}
