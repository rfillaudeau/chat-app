<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class MessageDto
{
    #[Assert\NotBlank]
    public ?string $text = null;
}