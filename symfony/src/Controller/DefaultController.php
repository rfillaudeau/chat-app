<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Discovery;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;

class DefaultController extends AbstractController
{
    #[Route(
        '/{reactRouting}',
        name: 'app_index',
        requirements: ['reactRouting' => '.+'],
        defaults: ['reactRouting' => null],
        priority: -1
    )]
    public function index(Request $request, Discovery $discovery, SerializerInterface $serializer): Response
    {
        $discovery->addLink($request);

        return $this->render('index.html.twig', [
            'user' => $serializer->serialize($this->getUser(), JsonEncoder::FORMAT)
        ]);
    }
}
