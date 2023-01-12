<?php

namespace App\Controller\Api;

use App\Dto\MessageDto;
use App\Entity\Message;
use App\Entity\Room;
use App\Entity\User;
use App\Security\RoomVoter;
use App\Service\MercurePublisher;
use Doctrine\ORM\EntityManagerInterface;
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

#[Route('/api/rooms/{id}/messages', name: 'api_rooms_messages_', requirements: ['id' => '\d+'])]
#[IsGranted(User::ROLE_USER)]
class RoomMessageController extends AbstractController
{
    public function __construct(
        private readonly SerializerInterface    $serializer,
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface     $validator
    )
    {
    }

    #[Route('', name: 'create', methods: [Request::METHOD_POST])]
    public function create(Room $room, Request $request, MercurePublisher $publisher): JsonResponse
    {
        $this->denyAccessUnlessGranted(RoomVoter::READ, $room);

        /** @var MessageDto $messageDto */
        $messageDto = $this->serializer->deserialize(
            $request->getContent(),
            MessageDto::class,
            JsonEncoder::FORMAT
        );

        $errors = $this->validator->validate($messageDto);
        if (count($errors) > 0) {
            throw new ValidationFailedException($messageDto, $errors);
        }

        $message = (new Message())
            ->setUser($this->getUser())
            ->setRoom($room)
            ->setText($messageDto->text);

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        $publisher->publishMessage($message);

        return $this->json($message, Response::HTTP_CREATED);
    }

//    #[Route('', name: 'read_all', methods: [Request::METHOD_GET])]
//    public function readAll(Room $room, MessageRepository $messageRepository):JsonResponse
//    {
//        $this->denyAccessUnlessGranted(RoomVoter::READ, $room);
//
//        $messages = $messageRepository->findByRoom($room);
//
//        return $this->json($messages);
//    }
}
