<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\RoomRepository;
use App\Security\RoomVoter;
use App\Validator as AppAssert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(
            security: 'is_granted("' . RoomVoter::READ . '", object)'
        ),
        new Post(),
        new Delete(
            security: 'is_granted("' . RoomVoter::DELETE . '", object)'
        ),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [
            Room::GROUP_DEFAULT,
            Room::GROUP_WITH_LAST_MESSAGE
        ]
    ],
    security: 'is_granted("' . User::ROLE_USER . '")'
)]
#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room
{
    public const GROUP_DEFAULT = 'default';
    public const GROUP_WITH_LAST_MESSAGE = 'room:with_last_message';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::GROUP_DEFAULT])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::GROUP_DEFAULT])]
    #[Assert\NotBlank]
    private ?string $name = null;

    /**
     * @var ArrayCollection|Collection|UserRoom[]
     */
    #[ORM\OneToMany(
        mappedBy: 'room',
        targetEntity: UserRoom::class,
        cascade: ['persist'],
//        fetch: 'EXTRA_LAZY',
        orphanRemoval: true
    )]
    #[Groups([self::GROUP_DEFAULT])]
    #[AppAssert\CurrentUserIsInArray]
    #[Assert\All([
        new Assert\NotBlank,
    ])]
    #[Assert\Count(min: 2)]
    private Collection|ArrayCollection|array $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<UserRoom>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(UserRoom $newUserRoom): void
    {
        foreach ($this->users as $userRoom) {
            if ($userRoom->getUser() === $newUserRoom->getUser()) {
                return;
            }
        }

        $newUserRoom->setRoom($this);
        $this->users->add($newUserRoom);
    }

    public function removeUser(UserRoom $userRoom): void
    {
        $userIndex = -1;
        for ($i = 0; $i < $this->users->count(); $i++) {
            if ($this->users[$i]->getUser() === $userRoom->getUser()) {
                $userIndex = $i;
                break;
            }
        }

        if ($userIndex === -1) {
            return;
        }

        $this->users[$userIndex]->setRoom(null);
        $this->users->remove($userIndex);
    }

    public function findUser(User $user): ?UserRoom
    {
        foreach ($this->users as $userRoom) {
            if ($userRoom->getUser() === $user) {
                return $userRoom;
            }
        }

        return null;
    }
}
