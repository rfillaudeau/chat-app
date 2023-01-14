<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Room;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public function applyToItem(
        QueryBuilder                $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string                      $resourceClass,
        array                       $identifiers,
        Operation                   $operation = null,
        array                       $context = []
    ): void
    {
        $this->addWhere($queryBuilder, $queryNameGenerator, $resourceClass);
    }

    public function applyToCollection(
        QueryBuilder                $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string                      $resourceClass,
        Operation                   $operation = null,
        array                       $context = []
    ): void
    {
        $this->addWhere($queryBuilder, $queryNameGenerator, $resourceClass);
    }

    private function addWhere(
        QueryBuilder                $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string                      $resourceClass
    ): void
    {
        if (Room::class !== $resourceClass || null === $user = $this->security->getUser()) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $joinAlias1 = $queryNameGenerator->generateJoinAlias('user_room1');
        $joinAlias2 = $queryNameGenerator->generateJoinAlias('user_room2');
        $parameterName = $queryNameGenerator->generateParameterName('current_user');

        $queryBuilder
            ->innerJoin(sprintf('%s.users', $rootAlias), $joinAlias1)
            ->innerJoin(
                sprintf('%s.users', $rootAlias),
                $joinAlias2,
                Join::WITH,
                sprintf(
                    '%s.room = %s.room AND %s.user = :%s',
                    $joinAlias1,
                    $joinAlias2,
                    $joinAlias2,
                    $parameterName
                )
            )
            ->setParameter($parameterName, $user);
    }
}
