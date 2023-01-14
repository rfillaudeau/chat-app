<?php

namespace App\Service;

use ApiPlatform\JsonLd\Serializer\ItemNormalizer;
use App\Entity\Message;
use App\Entity\Room;
use App\Entity\User;
use App\Entity\UserRoom;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
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
            $this->serializer->serialize($message, ItemNormalizer::FORMAT, [
                AbstractNormalizer::GROUPS => [
                    Message::GROUP_READ,
                    User::GROUP_READ,
                    Room::GROUP_READ,
                    UserRoom::GROUP_READ,
                ]
            ])
        );

        $this->hub->publish($update);
    }

    public function publishRoom(Room $room): void
    {
        $serializedRoom = $this->serializer->serialize($room, ItemNormalizer::FORMAT, [
            AbstractNormalizer::GROUPS => [
                Room::GROUP_READ,
                UserRoom::GROUP_READ,
                User::GROUP_READ,
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
