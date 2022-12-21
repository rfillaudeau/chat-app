<?php

namespace App\Entity;

use App\Repository\RoomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    /**
     * @var ArrayCollection|Collection|UserRoom[]
     */
    #[ORM\OneToMany(mappedBy: 'room', targetEntity: UserRoom::class, cascade: ['persist'], orphanRemoval: true)]
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
     * @return Collection<User>
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
            }
        }

        if ($userIndex === -1) {
            return;
        }

        $this->users[$i]->setRoom(null);
        $this->users->remove($userIndex);
    }
}
