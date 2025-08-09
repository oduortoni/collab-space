<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/*
||--------------------------------------------------------------------------|
||--------------------------------------------------------------------------|
||                                                                         ||
||                                                                         ||
||                           GROUPING TESTS                                ||
||                                                                         ||
||                                                                         ||
||--------------------------------------------------------------------------|
||--------------------------------------------------------------------------|
*/

/*
|
| Pest allows grouping of tests using the `group()` method.
| Grouping helps you organize and run subsets of your test suite
| more efficiently. You can assign any group name (e.g., unit, integration,
| feature) and run only that group using:
|
|     php artisan test --group=<group_name>
|
| This improves clarity and developer workflow when your project
| contains different types of tests: unit, integration, and feature.
|
*/

/*
|--------------------------------------------------------------------------
| Unit Tests
|--------------------------------------------------------------------------
|
| Group: 'unit'
| Scope: Isolated logic tests that do not hit the database or Laravel core.
| Location: tests/Unit/
|
| Run with:
|     php artisan test --group=unit
|
*/
uses()
    ->group('unit')
    ->in('Unit');

/*
|--------------------------------------------------------------------------
| Feature Tests
|--------------------------------------------------------------------------
|
| Group: 'feature'
| Scope: End-to-end flow via HTTP (routes, controllers, views).
| Simulates real user interaction with the app.
| Location: tests/Feature/
|
| Run with:
|     php artisan test --group=feature
|
*/
uses(Tests\TestCase::class)
    ->group('feature')
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Integration Tests
|--------------------------------------------------------------------------
|
| Group: 'integration'
| Scope: Tests multiple layers working together (e.g., service + repo + DB).
| No HTTP or controller involved.
| Location: tests/Integration/
|
| Run with:
|     php artisan test --group=integration
|
*/
uses(Tests\TestCase::class)
    ->group('integration')
    ->in('Integration');


/*
|--------------------------------------------------------------------------
|        end of test grouping                                             |
|--------------------------------------------------------------------------
*/
