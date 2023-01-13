<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
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
        new Get(),
        new Post(
            denormalizationContext: [
                AbstractNormalizer::GROUPS => [
                    Message::GROUP_CREATE
                ]
            ],
            securityPostValidation: 'is_granted("' . RoomVoter::CREATE_MESSAGE . '", object.getRoom())'
        ),
    ],
    security: 'is_granted("' . User::ROLE_USER . '")'
)]
#[ApiResource(
    uriTemplate: '/rooms/{id}/messages',
    operations: [
        new GetCollection(),
    ],
    uriVariables: [
        'id' => new Link(
            toProperty: 'room',
            fromClass: Room::class
        )
    ],
    security: 'is_granted("' . User::ROLE_USER . '")'
)]
#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    public const GROUP_DEFAULT = 'default';
    public const GROUP_CREATE = 'room:create';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::GROUP_DEFAULT])]
    private ?int $id = null;

    #[ORM\Column(name: 'message_text', type: Types::TEXT)]
    #[Groups([self::GROUP_DEFAULT, self::GROUP_CREATE])]
    #[Assert\NotBlank]
    private ?string $text = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::GROUP_DEFAULT])]
    #[Assert\NotNull]
    private ?User $user = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::GROUP_DEFAULT, self::GROUP_CREATE])]
    #[MaxDepth(1)]
    #[Assert\NotNull]
    private ?Room $room = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups([self::GROUP_DEFAULT])]
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
