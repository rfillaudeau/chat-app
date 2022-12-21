<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SecurityController extends AbstractController
{
    #[Route(path: '/api/login', name: 'api_login', methods: [Request::METHOD_POST])]
    public function login(): JsonResponse
    {
        $user = $this->getUser();
        if (null === $user) {
            return new JsonResponse('Invalid credentials', Response::HTTP_UNAUTHORIZED);
        }

        return $this->json($user);
    }

    #[Route(path: '/api/register', name: 'api_register', methods: [Request::METHOD_POST])]
    public function register(
        Request $request,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        if (null !== $this->getUser()) {
            return new JsonResponse('You already have an account', Response::HTTP_UNAUTHORIZED);
        }

//        $userDto = $serializer->deserialize(
//            $request->getContent(),
//            UserDto::class,
//            JsonEncoder::FORMAT
//        );

        $userDto = json_decode($request->getContent(), true);

        $user = (new User())
            ->setEmail($userDto['email'])
            ->setUsername($userDto['username']);

        // TODO: Try to move this validation in UserDto
        // Validate the user a second time to trigger the UniqueEntity validation
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            throw new ValidationFailedException($user, $errors);
        }

        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $userDto['password']
        );
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json($user, Response::HTTP_CREATED);
    }

    #[Route(path: '/api/me')]
    public function test()
    {
        $user = $this->getUser();
        if (null === $user) {
            return new JsonResponse('Invalid credentials', Response::HTTP_UNAUTHORIZED);
        }

        return $this->json($user);
    }

    #[Route(path: '/logout', name: 'app_logout', methods: [Request::METHOD_GET])]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
