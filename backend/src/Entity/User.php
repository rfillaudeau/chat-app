<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Controller\User\GetCurrentUser;
use App\Filter\ExcludeCurrentUserFilter;
use App\Filter\OrFilter;
use App\Repository\UserRepository;
use App\Security\UserVoter;
use App\State\UserPasswordProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(
            uriTemplate: '/users/{id}',
            requirements: ['id' => '\d+'],
            name: 'app_get_user'
        ),
        new Put(
            denormalizationContext: [
                AbstractNormalizer::GROUPS => [
                    self::GROUP_UPDATE,
                ]
            ],
            security: 'is_granted("' . UserVoter::UPDATE . '", object)',
        ),
        new Get(
            uriTemplate: '/users/me',
            controller: GetCurrentUser::class,
            read: false,
        ),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [
            self::GROUP_READ,
        ]
    ],
    security: 'is_granted("' . self::ROLE_USER . '")',
)]
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/auth/register',
            normalizationContext: [
                AbstractNormalizer::GROUPS => [
                    self::GROUP_READ,
                ]
            ],
            denormalizationContext: [
                AbstractNormalizer::GROUPS => [
                    self::GROUP_CREATE,
                ]
            ],
            processor: UserPasswordProcessor::class,
        ),
    ]
)]
#[ApiFilter(OrFilter::class, properties: ['username', 'email'])]
#[ApiFilter(ExcludeCurrentUserFilter::class)]
#[UniqueEntity('email')]
#[UniqueEntity('username')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const GROUP_CREATE = 'user:create';
    public const GROUP_READ = 'user:read';

    public const GROUP_UPDATE = 'user:update';
    public const ROLE_USER = 'ROLE_USER';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::GROUP_READ])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups([self::GROUP_READ, self::GROUP_CREATE, self::GROUP_UPDATE])]
    #[Assert\NotBlank(groups: [self::GROUP_CREATE, self::GROUP_UPDATE])]
    #[Assert\Length(max: 180, groups: [self::GROUP_CREATE, self::GROUP_UPDATE])]
    private ?string $email = null;

    #[ORM\Column(length: 30, unique: true)]
    #[Groups([self::GROUP_READ, self::GROUP_CREATE, self::GROUP_UPDATE])]
    #[Assert\NotBlank(groups: [self::GROUP_CREATE, self::GROUP_UPDATE])]
    #[Assert\Length(min: 2, max: 30, groups: [self::GROUP_CREATE, self::GROUP_UPDATE])]
    private ?string $username = null;

    #[ORM\Column]
    #[Ignore]
    private array $roles = [];

    #[ORM\Column]
    #[Ignore]
    private ?string $password = null;

    #[Assert\NotBlank(groups: [self::GROUP_CREATE])]
    #[Assert\Length(min: 6, groups: [self::GROUP_CREATE])]
    #[Groups([self::GROUP_CREATE])]
    private ?string $plainPassword = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(?string $username): self
    {
        $this->username = $username;
        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    #[Ignore]
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }
}
