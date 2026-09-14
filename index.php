<?php

$routes = [
    '/' => 'accueil',
    '/about' => 'about',
    '/interviews' => 'interviews',
    '/podcasts' => 'podcasts'
];



$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (array_key_exists($path, $routes)) {
    // If it does, include the corresponding file
    echo $path;
} else {
    // If it doesn't, return a 404 error
    header("HTTP/1.1 404 Not Found");
    echo "404 Not Found";
}