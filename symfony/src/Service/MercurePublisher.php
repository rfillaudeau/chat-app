<?php

namespace App\Service;

use App\Entity\Message;
use App\Entity\Room;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class MercurePublisher
{
    public function __construct(
        private readonly HubInterface        $hub,
        private readonly SerializerInterface $serializer
    )
    {
    }

    public function publishMessage(Message $message): void
    {
        $update = new Update(
            sprintf('rooms/%d', $message->getRoom()->getId()),
            $this->serializer->serialize($message, JsonEncoder::FORMAT)
        );

        $this->hub->publish($update);
    }

    public function publishRoom(Room $room): void
    {
        $serializedRoom = $this->serializer->serialize($room, JsonEncoder::FORMAT, [
            AbstractNormalizer::GROUPS => [
                Room::GROUP_DEFAULT,
                Room::GROUP_WITH_LAST_MESSAGE
            ]
        ]);

        foreach ($room->getUsers() as $userRoom) {
            $update = new Update(
                sprintf('users/%d/rooms', $userRoom->getUser()->getId()),
                $serializedRoom
            );

            $this->hub->publish($update);
        }
    }
}
