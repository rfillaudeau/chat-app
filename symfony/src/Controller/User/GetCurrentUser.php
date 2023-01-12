<?php

namespace App\Controller\User;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\User\UserInterface;

#[AsController]
class GetCurrentUser extends AbstractController
{
    public function __invoke(): User|UserInterface
    {
        return $this->getUser();
    }
}
