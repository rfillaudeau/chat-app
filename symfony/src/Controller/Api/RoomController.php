<?php

namespace App\Controller\Api;

use App\Dto\RoomDto;
use App\Entity\Room;
use App\Entity\User;
use App\Repository\RoomRepository;
use App\Repository\UserRepository;
use App\Security\RoomVoter;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/rooms', name: 'api_room_')]
#[IsGranted(User::ROLE_USER)]
class RoomController extends AbstractController
{
    public function __construct(
        private readonly SerializerInterface    $serializer,
        private readonly ValidatorInterface     $validator,
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    /**
     * @throws NonUniqueResultException
     */
    #[Route('', name: 'create', methods: [Request::METHOD_POST])]
    public function create(
        Request        $request,
        UserRepository $userRepository
    ): JsonResponse
    {
        /** @var RoomDto $roomDto */
        $roomDto = $this->serializer->deserialize(
            $request->getContent(),
            RoomDto::class,
            JsonEncoder::FORMAT
        );

        // TODO
        // Remove the current user from users
        // Or require 2 users in users (one must be the logged user)

        $errors = $this->validator->validate($roomDto);
        if (count($errors) > 0) {
            throw new ValidationFailedException($roomDto, $errors);
        }

        $room = (new Room())->setName($roomDto->name);
        $room->addUser($this->getUser());

        foreach ($roomDto->users as $username) {
            $room->addUser($userRepository->findOneByUsername($username));
        }

        $this->entityManager->persist($room);
        $this->entityManager->flush();

        return $this->json($room, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'read', requirements: ['id' => '\d+'], methods: [Request::METHOD_GET])]
    public function read(Room $room): JsonResponse
    {
        $this->denyAccessUnlessGranted(RoomVoter::READ, $room);

        return $this->json($room);
    }

    #[Route('', name: 'read_all', methods: [Request::METHOD_GET])]
    public function readAll(RoomRepository $repository): JsonResponse
    {
        $rooms = $repository->findByUser($this->getUser());

        return $this->json($rooms, Response::HTTP_OK, [], [
            AbstractNormalizer::GROUPS => [
                Room::GROUP_DEFAULT,
                Room::GROUP_WITH_LAST_MESSAGE
            ]
        ]);
    }

    /**
     * @throws NonUniqueResultException
     */
    #[Route('/{id}', name: 'update', requirements: ['id' => '\d+'], methods: [Request::METHOD_PUT])]
    public function update(
        Request        $request,
        Room           $room,
        UserRepository $userRepository
    ): JsonResponse
    {
        $this->denyAccessUnlessGranted(RoomVoter::UPDATE, $room);

        /** @var RoomDto $roomDto */
        $roomDto = $this->serializer->deserialize(
            $request->getContent(),
            RoomDto::class,
            JsonEncoder::FORMAT
        );

        $errors = $this->validator->validate($roomDto);
        if (count($errors) > 0) {
            throw new ValidationFailedException($roomDto, $errors);
        }

        $room->setName($roomDto->name);

        $usersToRemove = [];
        foreach ($room->getUsers() as $userRoom) {
            if ($userRoom->getUser() === $this->getUser()) {
                continue;
            }

            $usersToRemove[] = $userRoom->getUser();
        }

        $usersToAdd = [$this->getUser()];
        foreach ($roomDto->users as $username) {
            $user = $userRepository->findOneByUsername($username);
            $userIndex = array_search($user, $usersToRemove);
            if ($userIndex === false) {
                $usersToAdd[] = $user;
            } else {
                unset($usersToRemove[$userIndex]);
            }
        }

        foreach ($usersToAdd as $user) {
            $room->addUser($user);
        }

        foreach ($usersToRemove as $user) {
            $room->removeUser($user);
        }

        $this->entityManager->flush();

        return $this->json($room);
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: [Request::METHOD_DELETE])]
    public function delete(Room $room): JsonResponse
    {
        $this->denyAccessUnlessGranted(RoomVoter::DELETE, $room);

        $this->entityManager->remove($room);
        $this->entityManager->flush();

        return $this->json(null);
    }
}