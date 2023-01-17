<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
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
        new Put(
            security: 'is_granted("' . RoomVoter::UPDATE . '", object)'
        ),
        new Delete(
            security: 'is_granted("' . RoomVoter::DELETE . '", object)'
        ),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [
            Room::GROUP_READ,
            UserRoom::GROUP_READ,
            User::GROUP_READ,
        ]
    ],
    denormalizationContext: [
        AbstractNormalizer::GROUPS => [
            Room::GROUP_CREATE,
            UserRoom::GROUP_CREATE,
        ]
    ],
    security: 'is_granted("' . User::ROLE_USER . '")'
)]
#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room
{
    public const GROUP_CREATE = 'room:create';
    public const GROUP_READ = 'room:read';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::GROUP_READ])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::GROUP_READ, self::GROUP_CREATE])]
    #[Assert\NotBlank]
    private ?string $name = null;

    /**
     * @var ArrayCollection|Collection|UserRoom[]
     */
    #[ORM\OneToMany(
        mappedBy: 'room',
        targetEntity: UserRoom::class,
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    #[Groups([self::GROUP_READ, self::GROUP_CREATE])]
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

    /**
     * @param UserRoom[] $users
     * @return self
     */
    public function setUsers(array $users): self
    {
        // Filter duplicates
        $newUsers = [];
        foreach ($users as $userRoom) {
            $isInNewUsers = false;
            for ($i = 0; $i < count($newUsers); $i++) {
                if ($userRoom->getUser() === $newUsers[$i]->getUser()) {
                    $isInNewUsers = true;
                    break;
                }
            }

            if (!$isInNewUsers) {
                $newUsers[] = $userRoom;
            }
        }

        $usersToRemove = $this->users->toArray();
        foreach ($newUsers as $userRoom) {
            $index = false;
            for ($i = 0; $i < count($usersToRemove); $i++) {
                if ($userRoom->getUser() === $usersToRemove[$i]->getUser()) {
                    $index = $i;
                    break;
                }
            }

            if ($index === false) {
                $userRoom->setRoom($this);
                $this->users->add($userRoom);
            } else {
                array_splice($usersToRemove, $index, 1);
            }
        }

        foreach ($usersToRemove as $userRoom) {
            $userRoom->setRoom(null);
            $this->users->removeElement($userRoom);
        }

        return $this;
    }
}
