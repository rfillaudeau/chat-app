<?php

namespace App\Service;

use App\Entity\Message;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;

class MercurePublisher
{
    public function __construct(
        private readonly HubInterface $hub,
        private readonly SerializerInterface $serializer
    )
    {}

    public function publishMessage(Message $message): void
    {
        $update = new Update(
            sprintf('rooms/%d', $message->getRoom()->getId()),
            $this->serializer->serialize($message, JsonEncoder::FORMAT)
        );

        $this->hub->publish($update);
    }
}