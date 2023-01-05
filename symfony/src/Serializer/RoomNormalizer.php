<?php

namespace App\Serializer;

use App\Entity\Message;
use App\Entity\Room;
use App\Repository\MessageRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class RoomNormalizer implements NormalizerInterface
{
    public function __construct(
        // Known issue workaround (https://github.com/symfony/maker-bundle/issues/1252)
        #[Autowire(service: ObjectNormalizer::class)]
        private readonly NormalizerInterface $normalizer,
        private readonly MessageRepository   $messageRepository
    )
    {
    }

    /**
     * @param Room $object
     * @param string|null $format
     * @param array $context
     * @return mixed
     * @throws NonUniqueResultException
     * @throws ExceptionInterface
     */
    public function normalize(mixed $object, string $format = null, array $context = []): mixed
    {
        $data = $this->normalizer->normalize($object, $format, $context);

        if (
            array_key_exists(AbstractNormalizer::GROUPS, $context)
            && in_array(Room::GROUP_WITH_LAST_MESSAGE, $context[AbstractNormalizer::GROUPS])
        ) {
            $data['lastMessage'] = null;

            $lastMessage = $this->messageRepository->findLastInRoom($object);
            if (null !== $lastMessage) {
                $data['lastMessage'] = $this->normalizer->normalize($lastMessage, $format, [
                    AbstractNormalizer::GROUPS => [Message::GROUP_DEFAULT]
                ]);
            }
        }

        return $data;
    }

    public function supportsNormalization(mixed $data, string $format = null): bool
    {
        return $data instanceof Room;
    }
}
