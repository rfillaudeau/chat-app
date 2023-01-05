<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/users', name: 'api_users_')]
#[IsGranted(User::ROLE_USER)]
class UserController extends AbstractController
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    #[Route('/me', name: 'me', methods: [Request::METHOD_GET])]
    public function me(): JsonResponse
    {
        return $this->json($this->getUser(), Response::HTTP_OK, [], [
            AbstractNormalizer::GROUPS => [
                User::GROUP_DEFAULT
            ]
        ]);
    }

    #[Route('', name: 'search', methods: [Request::METHOD_GET])]
    public function search(Request $request): JsonResponse
    {
        $searchQuery = $request->query->get('search');

        $users = [];
        if (strlen($searchQuery) > 0) {
            $users = $this->userRepository->searchByUsernameOrEmail($searchQuery, [$this->getUser()]);
        }

        return $this->json($users, Response::HTTP_OK, [], [
            AbstractNormalizer::GROUPS => [
                User::GROUP_DEFAULT
            ]
        ]);
    }
}
