<?php

namespace App\Dto;

use App\Entity\User;
use App\Validator\UniqueFieldInEntity;
use Symfony\Component\Validator\Constraints as Assert;

class UserDto
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 180)]
    #[UniqueFieldInEntity(
        field: 'email',
        entityClass: User::class
    )]
    public ?string $email = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 30)]
    #[UniqueFieldInEntity(
        field: 'username',
        entityClass: User::class
    )]
    public ?string $username = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 6)]
    public ?string $password = null;
}
