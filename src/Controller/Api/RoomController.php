<?php

namespace App\Controller\Api;

use App\Dto\RoomDto;
use App\Entity\Room;
use App\Entity\User;
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
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/rooms', name: 'api_room_')]
#[IsGranted(User::ROLE_USER)]
class RoomController extends AbstractController
{
    public function __construct(
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator,
        private readonly EntityManagerInterface $entityManager
    )
    {}

    /**
     * @throws NonUniqueResultException
     */
    #[Route('', name: 'create', methods: [Request::METHOD_POST])]
    public function create(
        Request $request,
        UserRepository $userRepository
    ): JsonResponse
    {
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

        dump($roomDto);

        $room = (new Room())->setName($roomDto->name);
        $room->addUser($this->getUser());

        foreach ($roomDto->users as $username) {
            $room->addUser($userRepository->findOneByUsername($username));
        }

        dump($room);

        $this->entityManager->persist($room);
        $this->entityManager->flush();

        return $this->json($room, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'read', requirements: ['id' => '\d+'], methods: [Request::METHOD_GET])]
    public function read(Room $room): JsonResponse
    {
        $this->denyAccessUnlessGranted(RoomVoter::VIEW, $room);

        return $this->json($room);
    }
}
