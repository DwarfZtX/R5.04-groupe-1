<?php

$routes = [
    '/~i2400919/WebdocAGENCE1/' => 'accueil',
    '/~i2400919/WebdocAGENCE1/test' => 'test',
    '/~i2400919/WebdocAGENCE1/about' => 'about',
    '/~i2400919/WebdocAGENCE1/interviews' => 'interviews',
    '/~i2400919/WebdocAGENCE1/podcasts' => 'podcasts'
];



$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (array_key_exists($path, $routes)) {
    // If it does, include the corresponding file
    echo $path;
    include("about.html");
} else {
    // If it doesn't, return a 404 error
    header("HTTP/1.1 404 Not Found");
    echo "404 Not Found";
}