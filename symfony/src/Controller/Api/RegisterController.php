<?php

namespace App\Controller\Api;

use App\Dto\UserDto;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
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

class RegisterController extends AbstractController
{
    #[Route(path: '/api/auth/register', name: 'api_register', methods: [Request::METHOD_POST])]
    public function register(
        Request                     $request,
        SerializerInterface         $serializer,
        ValidatorInterface          $validator,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface      $entityManager
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
}
