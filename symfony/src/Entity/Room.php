<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\RoomRepository;
use App\Security\RoomVoter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(
            security: 'is_granted("' . RoomVoter::READ . '", object)'
        ),
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

    public function addUser(User $user): void
    {
        foreach ($this->users as $userRoom) {
            if ($userRoom->getUser() === $user) {
                return;
            }
        }

        $userRoom = (new UserRoom())
            ->setUser($user)
            ->setRoom($this);

        $this->users->add($userRoom);
    }

    public function removeUser(User $user): void
    {
        $userIndex = -1;
        for ($i = 0; $i < $this->users->count(); $i++) {
            if ($this->users[$i]->getUser() === $user) {
                $userIndex = $i;
                break;
            }
        }

        if ($userIndex === -1) {
            return;
        }

        $this->users[$i]->setRoom(null);
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
