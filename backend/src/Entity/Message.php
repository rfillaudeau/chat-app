<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use App\Controller\Message\GetLastMessageInRoom;
use App\Repository\MessageRepository;
use App\Security\RoomVoter;
use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(
            security: 'is_granted("' . RoomVoter::READ . '", object.getRoom())',
            name: 'app_get_message',
        ),
        new Get(
            uriTemplate: '/rooms/{id}/messages/last',
            uriVariables: [
                'id' => new Link(
                    toProperty: 'room',
                    fromClass: Room::class
                )
            ],
            controller: GetLastMessageInRoom::class,
            read: false,
        ),
        new Post(
            denormalizationContext: [
                AbstractNormalizer::GROUPS => [
                    Message::GROUP_CREATE
                ]
            ],
            securityPostValidation: 'is_granted("' . RoomVoter::CREATE_MESSAGE . '", object.getRoom())'
        ),
        new GetCollection(
            uriTemplate: '/rooms/{id}/messages',
            uriVariables: [
                'id' => new Link(
                    toProperty: 'room',
                    fromClass: Room::class
                )
            ],
            normalizationContext: [
                AbstractNormalizer::GROUPS => [
                    Message::GROUP_READ,
                    User::GROUP_READ,
                ]
            ],
        // TODO: Add security
        ),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [
            Message::GROUP_READ,
            User::GROUP_READ,
            Room::GROUP_READ,
            UserRoom::GROUP_READ,
        ]
    ],
    security: 'is_granted("' . User::ROLE_USER . '")',
)]
#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    public const GROUP_CREATE = 'message:create';
    public const GROUP_READ = 'message:read';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::GROUP_READ])]
    private ?int $id = null;

    #[ORM\Column(name: 'message_text', type: Types::TEXT)]
    #[Groups([self::GROUP_READ, self::GROUP_CREATE])]
    #[Assert\NotBlank]
    private ?string $text = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::GROUP_READ])]
    #[MaxDepth(1)]
    #[Assert\NotNull]
    private ?User $user = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::GROUP_READ, self::GROUP_CREATE])]
    #[MaxDepth(1)]
    #[Assert\NotNull]
    private ?Room $room = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups([self::GROUP_READ])]
    private DateTime $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getRoom(): ?Room
    {
        return $this->room;
    }

    public function setRoom(?Room $room): self
    {
        $this->room = $room;

        return $this;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }
}
