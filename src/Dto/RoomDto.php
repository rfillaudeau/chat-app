<?php

namespace App\Dto;

use App\Validator\UsernameExists;
use Symfony\Component\Validator\Constraints as Assert;

class RoomDto
{
    #[Assert\NotBlank]
    public ?string $name = null;

    #[Assert\All([
        new Assert\NotBlank,
        new UsernameExists()
    ])]
    #[Assert\Count(min: 1)]
    public array $users = [];
}
