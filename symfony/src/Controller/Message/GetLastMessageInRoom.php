<?php

namespace App\Controller\Message;

use App\Entity\Room;
use App\Repository\MessageRepository;
use App\Security\RoomVoter;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetLastMessageInRoom extends AbstractController
{
    public function __construct(private readonly MessageRepository $messageRepository)
    {
    }

    /**
     * @throws NonUniqueResultException
     */
    public function __invoke(Room $room): Response
    {
        $this->denyAccessUnlessGranted(RoomVoter::READ, $room);

        $message = $this->messageRepository->findLastInRoom($room);
        if (null === $message) {
            return new Response(null, Response::HTTP_NO_CONTENT);
        }

        return $this->redirectToRoute('app_get_message', ['id' => $message->getId()]);
    }
}
