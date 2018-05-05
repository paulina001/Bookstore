<?php
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $books = Book::loadAll($conn, isset($pathId) ? $pathId : null);
        $jsonBooks = [];
        foreach ($books as $book) {
            $jsonBooks[] = json_decode(json_encode($book), true);
        }
        $response = ['success' => $jsonBooks];
    } elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
        parse_str(file_get_contents("php://input"), $postVars);
        $book = new Book($conn);
        $book->setTitle($postVars['title']);
        $book->setDescription($postVars['description']);
        $book->setAuthorId($postVars['author_id']);

        $book->save();

        $response = ['success' => [json_decode(json_encode($book), true)]];
    } elseif ($_SERVER['REQUEST_METHOD'] == 'PATCH') {
        parse_str(file_get_contents("php://input"), $patchVars);
        $bookToEdit = Book::loadAll($conn, $pathId)[0];
        $bookToEdit->setTitle($patchVars['title']);
        $bookToEdit->setDescription($patchVars['description']);
        $bookToEdit->setAuthorId($patchVars['author_id']);

        $bookToEdit->save();

        $response = ['success' => [json_decode(json_encode($bookToEdit), true)]];
    } elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        parse_str(file_get_contents("php://input"), $deleteVars);
        $bookToDelete = Book::loadAll($conn, $pathId)[0];
        $bookToDelete->delete();

        $response = ['success' => 'deleted'];
    } else {
        $response = ['error' => 'Wrong request method'];
    }

