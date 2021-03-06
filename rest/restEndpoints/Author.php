<?php
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $authors = Author::loadAll($conn, isset($pathId) ? $pathId : null);
    $jsonAuthors = [];
    foreach ($authors as $author) {
        $jsonAuthors[] = json_decode(json_encode($author), true);
    }
    $response = ['success' => $jsonAuthors];
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {

    parse_str(file_get_contents("php://input"), $postVars);
    $author = new Author($conn);
    $author->setName($postVars['name']);
    $author->setSurname($postVars['surname']);

    $author->save();

    $response = ['success' => [json_decode(json_encode($author), true)]];
} elseif ($_SERVER['REQUEST_METHOD'] == 'PATCH') {
    parse_str(file_get_contents("php://input"), $patchVars);
    $authorToEdit = Author::loadAll($conn, $pathId)[0];
    $authorToEdit->setName($patchVars['name']);
    $authorToEdit->setSurname($patchVars['surname']);

    $authorToEdit->save();

    $response = ['success' => [json_decode(json_encode($authorToEdit), true)]];
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $deleteVars);
    $authorToDelete = Author::loadAll($conn, $pathId)[0];
    $authorToDelete->delete();

    $response = ['success' => 'deleted'];
} else {
    $response = ['error' => 'Wrong request method'];
}