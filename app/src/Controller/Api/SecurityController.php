<?php

namespace App\Controller\Api;

use App\Dto\UserDto;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use LogicException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;
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
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        if (null !== $this->getUser()) {
            return new JsonResponse('You already have an account', Response::HTTP_UNAUTHORIZED);
        }

        /** @var UserDto $userDto */
        $userDto = $serializer->deserialize(
            $request->getContent(),
            UserDto::class,
            JsonEncoder::FORMAT
        );

        $errors = $validator->validate($userDto);
        if (count($errors) > 0) {
            throw new ValidationFailedException($userDto, $errors);
        }

        $user = (new User())
            ->setEmail($userDto->email)
            ->setUsername($userDto->username);

        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $userDto->password
        );
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json($user, Response::HTTP_CREATED);
    }

    #[Route(path: '/logout', name: 'app_logout', methods: [Request::METHOD_GET])]
    public function logout(): void
    {
        throw new LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(
        path: '/api/{routeName}',
        name: 'api_not_found',
        defaults: ['routeName' => null],
        priority: -1
    )]
    public function notFound(?string $routeName): JsonResponse
    {
        return $this->json(
            sprintf('Route "/api/%s" not found.', $routeName),
            Response::HTTP_NOT_FOUND
        );
    }
}
